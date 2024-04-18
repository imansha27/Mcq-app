import re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

def extract_chemistry_keywords(text):

    chemical_pattern = r'\b(?:[A-Z][a-z]*\d*)+\b(?!\s*=)' 
    reaction_pattern = r'\b(?:[A-Z][a-z]*\d*)+\s*[-=]?>+\s*(?:[A-Z][a-z]*\d*)+\b'
    ol_pattern = r'\b\w*ol\b' #alchol patterns

    # Initialize WordNet Lemmatizer
    lemmatizer = WordNetLemmatizer()
    chemistry_terms_list = ['alcohol', 'alkene', 'acid', 'salt', 'aqueous', 'acidic', 'equi-molar', 'ideal gas', 'gaseous', 'temperature', 'pressure', 'volume', 'increasing','decreasing', ' ideally behaving gas']
    chemistry_terms_pattern = r'\b(?:' + '|'.join(chemistry_terms_list) + r')(?:s)?\b'
    
    
    tokens = word_tokenize(text)
    # Lemmatize the tokens
    lemmatized_tokens = [lemmatizer.lemmatize(token.lower()) for token in tokens]
    
    # get words from the lemmatized tokens
    chemicals = re.findall(chemical_pattern, ' '.join(tokens))
    reactions = re.findall(reaction_pattern, ' '.join(tokens))
    # get the terms in the  chemistry_terms_list,chemistry_terms_pattern and alchol patterns
    chemistry_terms = re.findall(ol_pattern, ' '.join(tokens))
    chemistry_terms += [word for word in lemmatized_tokens if word in chemistry_terms_list]
    chemistry_terms = re.findall(chemistry_terms_pattern, ' '.join(tokens))

  
    keywords = chemicals + reactions + chemistry_terms

    # remove stopwords
    english_stopwords = set(stopwords.words('english'))
    keywords = [word for word in keywords if word.lower() not in english_stopwords]
    
    # Remove duplicate words
    keywords = list(set(keywords))

    return keywords




# Extract chemistry-related keywords from the text
#keywords = extract_chemistry_keywords(text)
#print("Extracted Keywords:", keywords)


# Example text
# text = ""


if __name__ == "__main__":
    import sys

    # Extract keywords 
    if len(sys.argv) > 1:
        text = ' '.join(sys.argv[1:])
        keywords = extract_chemistry_keywords(text)
        print('\n'.join(keywords))