from operator import le
import os
import sys
from re import I, T
import io 
import numpy
import re
import math
import json

"""Word
"""
UPPER = r"[A-ZÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬĐÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸ]"
LOWER = r"[a-zàáảãạăằắẳẵặâầấẩẫậđèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹ]"
W = UPPER[:-1] + LOWER[1:]  # upper and lower

"""Priority 1
"""
specials = [
    r"=\>",
    r"==>",
    r"->",
    r"\.{2,}",
    r"-{2,}",
    r">>",
    r"\d+x\d+",    # 3x4, 2x6
    r"v\.v\.\.\.",  # v.v...
    r"v\.v\.",     # v.v.
    r"v\.v",       # v.v
    r"°[CF]"
]
specials = "(?P<SPECIAL>(" + "|".join(specials) + "))"

abbreviations = [
    r"[A-ZĐ]+&[A-ZĐ]+",  # & at middle of word (e.g. H&M)
    r"T\.Ư",  # dot at middle of word
    f"{UPPER}+(?:\.{W}+)+\.?",
    f"{W}+['’]{W}+",  # ' ’ at middle of word
    # e.g. H'Mông, xã N’Thôn Hạ
    r"TP\.",
    r"[A-ZĐ]+\.(?!$)",  # dot at the end of word
    r"Tp\.",
    r"Mr\.", "Mrs\.", "Ms\.",
    r"Dr\.", "ThS\.", "Th.S", "Th.s",
    r"e-mail",            # - at middle of word
    r"\d+[A-Z]+\d*-\d+",  # vehicle plates
    # e.g. 43H-0530
    r"NĐ-CP"
]
excludes = [
    r"TP\.HCM\.",
    r"TP\.BMT\.",
]
abbreviations = "(?P<ABBR>(" + "|".join(abbreviations) + "))(?<!" + "|".join(excludes) + ")"

"""Priority 2
"""

# urls pattern from nltk
# https://www.nltk.org/_modules/nltk/tokenize/casual.html
# with Vu Anh's modified to match fpt protocol
url = r"""             # Capture 1: entire matched URL
  (?:
  (ftp|http)s?:               # URL protocol and colon
    (?:
      /{1,3}            # 1-3 slashes
      |                 #   or
      [a-z0-9%]         # Single letter or digit or '%'
                        # (Trying not to match e.g. "URI::Escape")
    )
    |                   #   or
                        # looks like domain name followed by a slash:
    [a-z0-9.\-]+[.]
    (?:[a-z]{2,13})
    /
  )
  (?:                                  # One or more:
    [^\s()<>{}\[\]]+                   # Run of non-space, non-()<>{}[]
    |                                  #   or
    \([^\s()]*?\([^\s()]+\)[^\s()]*?\) # balanced parens, one level deep: (...(...)...)
    |
    \([^\s]+?\)                        # balanced parens, non-recursive: (...)
  )+
  (?:                                  # End with:
    \([^\s()]*?\([^\s()]+\)[^\s()]*?\) # balanced parens, one level deep: (...(...)...)
    |
    \([^\s]+?\)                        # balanced parens, non-recursive: (...)
    |                                  #   or
    [^\s`!()\[\]{};:'".,<>?«»“”‘’]     # not a space or one of these punct chars
  )
  |                        # OR, the following to match naked domains:
  (?:
    (?<!@)                 # not preceded by a @, avoid matching foo@_gmail.com_
    [a-z0-9]+
    (?:[.\-][a-z0-9]+)*
    [.]
    (?:[a-z]{2,13})
    \b
    /?
    (?!@)                  # not succeeded by a @,
                           # avoid matching "foo.na" in "foo.na@example.com"
  )
"""
url = "(?P<URL>" + url + ")"

email = r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+"
email = "(?P<EMAIL>" + email + ")"

phone = [
    r"\d{2,}-\d{3,}-\d{3,}"       # e.g. 03-5730-2357
                                  # very careful, it's easy to conflict with datetime
]
phone = "(?P<PHONE>(" + "|".join(phone) + "))"

datetime = [
    # date
    r"\d{1,2}\/\d{1,2}\/\d+",     # e.g. 02/05/2014
    r"\d{1,2}\/\d{2,4}",          # e.g. 02/2014
                                  #   [WIP] conflict with number 1/2 (a half)
    r"\d{1,2}-\d{1,2}-\d+",       # e.g. 02-03-2014
    r"\d{1,2}-\d{2,4}",           # e.g. 08-2014
                                  #   [WIP] conflict with range 5-10 (from 5 to 10)
    r"\d{1,2}\.\d{1,2}\.\d+",     # e.g. 20.08.2014
    r"\d{4}\/\d{1,2}\/\d{1,2}",   # e.g. 2014/08/20
    r"\d{2}:\d{2}:\d{2}"          # time
                                  # e.g. 10:20:50 (10 hours, 20 minutes, 50 seconds)
]
datetime = "(?P<DATETIME>(" + "|".join(datetime) + "))"

name = [
    r"\d+[A-Z]+\d+",
    r"\d+[A-Z]+"  # e.g. 4K
]
name = "(?P<NAME>(" + "|".join(name) + "))"

number = [
    r"\d+(?:\.\d+)+,\d+",     # e.g. 4.123,2
    r"\d+(?:\.\d+)+",         # e.g. 60.542.000
    r"\d+(?:,\d+)+",          # e.g. 100,000,000
    r"\d+(?:[\.,_]\d+)?",     # 123
]
number = "(?P<NUMBER>(" + "|".join(number) + "))" 

"""Priority 3
"""

word = r"(?P<word>\w+)"

word_hyphen = [
    r"(?<=\b)\w+\-[\w+-]*\w+"        # before word_hyphen must be word boundary
                                     # case to notice: 1.600m-2.000m
]
word_hyphen = "(?P<WORD_HYPHEN>(" + "|".join(word_hyphen) + "))"

symbol = [
    r"\+",
    r"×",
    r"-",
    r"÷",
    r":+",
    r"%",
    r"%",
    r"\$",
    r"\>",
    r"\<",
    r"=",
    r"\^",
    r"_",
    r":+"
]
symbol = "(?P<SYM>(" + "|".join(symbol) + "))"

punct = [
    r"\.",
    r"\,",
    r"\(",
    r"\)"
]
punct = "(?P<PUNCT>(" + "|".join(punct) + "))"

# non_word = r"(?P<non_word>[^\w\s])"

# Caution: order is very important for regex
patterns = [
    # specials,          # Priority 1
    # abbreviations,
    url,               # Priority 2
    email,
    phone,
    datetime,          # datetime must be before number
    # name,
    number,
    # word_hyphen,       # Priority 3
    # word,
    symbol,
    punct,
    # non_word           # non_word must be last
]

pattern_datetime = re.compile(datetime, re.VERBOSE | re.UNICODE)
pattern_url = re.compile(url, re.VERBOSE | re.UNICODE)
pattern_phone = re.compile(phone, re.VERBOSE | re.UNICODE)
pattern_number = re.compile(number, re.VERBOSE | re.UNICODE)
pattern_email = re.compile(email, re.VERBOSE | re.UNICODE)
pattern_symbol = re.compile(symbol, re.VERBOSE | re.UNICODE)
pattern_punct = re.compile(punct, re.VERBOSE | re.UNICODE)

from nltk import word_tokenize, sent_tokenize 

os.chdir(os.path.dirname(__file__))
current_dir = os.getcwd()

# word tokenizer & train n-gram model
train_file = ''.join((current_dir, '/data_train.txt'))
if os.path.isfile(train_file):
    with io.open(train_file, encoding='utf8') as fin:
        text = fin.read()

list_text = text.split(" ")
len_train = len(list(dict.fromkeys(list_text))) + 2 # 2 is <s> and </s>

# Tokenize the text.
def tokenize(text):
    text_split = text.split(' ')
    new_text_split = []
    for i in text_split:
        if re.match(pattern_url, i):
            new_text_split.append("url")
        elif re.match(pattern_email, i):
            new_text_split.append("email")
        else:
            new_text_split.append(i)
    new_text = " ".join(new_text_split)

    tokenized_text = [list(map(str.lower, word_tokenize(sent)))
                for sent in sent_tokenize(new_text)]

    new_tokenized_text = []
    for sentence in tokenized_text:
        new_sentence = []
        start = 0
        for word in sentence:
            if (start == 0):
                new_sentence.append("<s>")
                start = 1
            if re.match(pattern_datetime, word):
                new_sentence.append("DATETIME")
            elif re.match(pattern_phone, word):
                new_sentence.append("PHONE")
            elif re.match(pattern_number, word):
                new_sentence.append("NUMBER")
            elif re.match(pattern_symbol, word):
                new_sentence.append("SYMBOL_OPERATION")
            elif (word == "email"):
                new_sentence.append("EMAIL")
            elif (word == "url"):
                new_sentence.append("URL")
            elif (word == "."):
                new_sentence.append("</s>")
            # elif re.match(pattern_punct, word):
            #     break
            else:
                new_sentence.append(word)
        if (new_sentence[len(new_sentence)-1] != "</s>"):
           new_sentence.append("</s>")
        new_tokenized_text.append(new_sentence)

    return new_tokenized_text

tokenized_text = tokenize(text)

# Preprocess the tokenized text for 3-grams language modelling
from nltk.lm.preprocessing import padded_everygram_pipeline
from nltk.lm import MLE

n = 3
train_data, padded_sents = padded_everygram_pipeline(3, tokenized_text)

model = MLE(n) # Lets train a 3-grams maximum likelihood estimation model.
model.fit(train_data, padded_sents)

# bigram_dict
# def build_unigram_dict(tokenized_text):
#     uni_gram_base = ''.join((current_dir, '/uni-gram.txt'))
#
#     dict_uni_gram_base = {}
#     for i in range(0,len(tokenized_text)):
#         for j in range(0,len(tokenized_text[i])):
#             unigram = 0
#             unigram = model.score(tokenized_text[i][j])
#             dict_uni_gram_base[tokenized_text[i][j]] = unigram
#
#     with io.open(uni_gram_base, 'w', encoding='utf8') as json_file:
#         json.dump(dict_uni_gram_base, json_file, ensure_ascii=False)
#
#     return dict_uni_gram_base


# bigram_dict
def build_bigram_dict(tokenized_text):
    bi_gram_base = ''.join((current_dir, '/bi-gram.txt'))

    dict_bi_gram_base = {}
    for i in range(0,len(tokenized_text)):
        for j in range(0,len(tokenized_text[i])):
            bigram = 0
            if (j==0):
                continue
            else:
                bigram = model.score(tokenized_text[i][j], tokenized_text[i][j-1] .split())
                dict_bi_gram_base[tokenized_text[i][j] + "|" + tokenized_text[i][j-1]] = bigram 
                    
    with io.open(bi_gram_base, 'w', encoding='utf8') as json_file:
        json.dump(dict_bi_gram_base, json_file, ensure_ascii=False)

    return dict_bi_gram_base


#  trigram_dict
# def build_trigram_dict(tokenized_text):
#     tri_gram_base = ''.join((current_dir, '/tri-gram.txt'))
#     dict_tri_gram_base = {}
#     for i in range(0,len(tokenized_text)):
#         for j in range(0,len(tokenized_text[i])):
#             trigram = 0
#             word1 = ""
#             word2 = ""
#             if (j==0 or j ==1):
#                 continue
#             else:
#                 word1 = tokenized_text[i][j]
#                 word2 = tokenized_text[i][j-2] + " " + tokenized_text[i][j-1]
#                 trigram = model.score(word1, word2 .split())
#                 dict_tri_gram_base[word1 + "|" + word2] = trigram
#
#     with io.open(tri_gram_base, 'w', encoding='utf8') as json_file:
#         json.dump(dict_tri_gram_base, json_file, ensure_ascii=False)
#
#     return dict_tri_gram_base


#  bigram_prob
def bi_gram_prob(text,dict_bi_gram_base):
    text = tokenize(text)
    probability = []
    for sentence in text:
        prob_sentence = []
        a=0
        while (a<len(sentence)):
            if (a==0):
                a=a+1
                continue
            else:
                key = sentence[a] + "|" + sentence[a-1]
                if (dict_bi_gram_base.get(key) != None):
                    prob_sentence.append(math.log(dict_bi_gram_base[key], 10))
                    a=a+1
                else:
                    bigram = (model.counts[[sentence[a-1]]][sentence[a]] + 0.5 ) / (model.counts[sentence[a-1]] + (0.5*len_train))
                    prob_sentence.append(math.log(bigram, 10))
                    a=a+1
                    continue
        probability.append(math.exp(sum(prob_sentence)))

    return (numpy.mean(probability))


#  tri-bi-uni-gram_prob
# def tri_bi_gram_prob(text,dict_tri_gram_base,dict_bi_gram_base,dict_uni_gram_base):
#     text = tokenize(text)
#     probability = []
#     a=2
#     for sentence in text:
#         while (a<len(sentence)):
#             if (a==0):
#                 a=a+1
#                 continue
#             else:
#                 word1 = sentence[a]
#                 word2 = sentence[a-2] + " " + sentence[a-1]
#                 key = word1+ "|" + word2
#                 if (dict_tri_gram_base.get(key) != None):
#                     probability.append(dict_tri_gram_base[key])
#                     a=a+1
#                 else:
#                     key = sentence[a] + "|" + sentence[a-1]
#                     if (dict_bi_gram_base.get(key) != None):
#                         probability.append(dict_bi_gram_base[key])
#                         a=a+2
#                     else:
#                         if(dict_uni_gram_base.get(sentence[a]) != None):
#                             probability.append(dict_uni_gram_base[sentence[a]])
#                             a=a+3
#                         else:
#                             a=a+3
#                             continue
#     if(probability==[]):
#         return 0
#     else:
#         return(numpy.mean(probability))

#  tri-gram_prob
# def tri_gram_prob(text,dict_tri_gram_base):
#     text = tokenize(text)
#     probability = []
#     a=2
#     for sentence in text:
#         while (a<len(sentence)):
#             if (a==0):
#                 a=a+1
#                 continue
#             else:
#                 word1 = sentence[a]
#                 word2 = sentence[a-2] + " " + sentence[a-1]
#                 key = word1+ "|" + word2
#                 if (dict_tri_gram_base.get(key) != None):
#                     probability.append(dict_tri_gram_base[key])
#                     a=a+1
#                 else:
#                     a=a+1
#                     continue
#     if(probability==[]):
#         return 0
#     else:
#         return(numpy.mean(probability))

#  uni-gram_prob
# def uni_gram_prob(text,dict_uni_gram_base):
#     text = tokenize(text)
#     probability = []
#     a=0
#     for sentence in text:
#         while (a<len(sentence)):
#             if(dict_uni_gram_base.get(sentence[a]) != None):
#                 probability.append(dict_uni_gram_base[sentence[a]])
#                 a=a+1
#             else:
#                 a=a+1
#                 continue
#     if(probability==[]):
#         return 0
#     else:
#         return(numpy.mean(probability))

# dict_bi_gram_base  =  build_bigram_dict(tokenized_text)
with open(''.join((current_dir, '/bi-gram.txt')), encoding='utf-8') as json_file:
    dict_bi_gram_base = json.load(json_file)


# post_list: received from node.js
def score_post_2_gram(post_list, dict_n_gram_base):
    prob_list = []
    for i in post_list:
        prob_list.append(bi_gram_prob(i,dict_n_gram_base))
    return prob_list

post_list = []
for i in range(1, len(sys.argv)):
    input_file = sys.argv[i]
    with io.open(input_file, encoding='utf8') as f:
        tempList = [line.rstrip('\n') for line in f]
        post_list.append(' '.join(tempList))

prob_list = score_post_2_gram(post_list, dict_bi_gram_base)
print(prob_list)

# def perplexity(list, prob_list ):
#     perplexity = pow(prob_list,(-1/len(list)))
#     return perplexity