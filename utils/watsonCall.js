module.exports = async function (userText){
  const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1.js');
  
  const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    version: '2018-11-16',
    iam_apikey: 'Ohosf4bP5cVpnI125et2u4pMw592bhrZ1xU-502dxKYF',
    url: 'https://gateway.watsonplatform.net/natural-language-understanding/api'
  });

  const analyzeParams = {
    'text': userText,
    'features': {
      'keywords': {
        'limit': 3
      },
      'emotion': {}, 
    'categories': {'limit': 3}
    }
  };

  try {
    let res = await naturalLanguageUnderstanding.analyze(analyzeParams);
    let out = res.keywords.map(obj => obj.text).join();
    return out;
  }
  catch(err) {
    return 'Error'
  }
}

