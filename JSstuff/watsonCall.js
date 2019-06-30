module.exports = function (userText){

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
 
let str = "";
naturalLanguageUnderstanding.analyze(analyzeParams)
  .then(analysisResults => {
    splitted = analysisResults.keywords.map(obj => obj.text);
    out = splitted.join();
	return out;
    
//     let emotes = analysisResults.emotion.document.emotion   
//     let max = 0 
//     let maxem 
//     for (emotion in emotes) {
//         if (emotes[emotion]>max){
//             max = emotes[emotion]   
//             maxem = emotion
//         }
//     }
//     console.log(maxem)
//     if(maxem != 'joy'){console.log('severe')}
//     else {console.log('not severe') }
})
//   .catch(err => {
//     console.log('error:', err);
//   });

}


