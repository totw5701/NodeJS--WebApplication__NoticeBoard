const fs = require('fs');

fs.readFile('nodejs/sample.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }  
    console.log(data)
});


//fs.readFile('sample.txt', 'utf8', function(err,data){
//    if (err) {
//        console.error(err)
//        return
//    }  
//    console.log(data)
//}) 이렇게 써도 ㄱㅊ 