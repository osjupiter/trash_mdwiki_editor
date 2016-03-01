var express = require('express');
var app = express();
var fs = require('fs');
var config=require("confu")("./","config.json")

app.use(require('body-parser')());
app.set('view engine', 'jade');
var basicAuth = require('basic-auth-connect');
app.use(basicAuth(config.user, config.passward));

var isValidMarkDown=function(name){
    if(name=="")return false;
    if(!name.match(/\.md/))return false;
    if(name.match(/\//))return false;
    return true
}

app.get('/', function (req, res) {
    var files=fs.readdirSync(config.mdwikiDir);
    files=files.filter(isValidMarkDown)
    var name=req.query.name;
    var content;
    if(name=="new"){
        content=""
    }else if(!isValidMarkDown(name)){
        res.send("Illigal")
    }else{
        content=fs.readFileSync(config.mdwikiDir+name);
    }
    res.render('index', { title: name, files: files, content:content});
});

app.post("/save",function(req,res){
    var name=req.body.name;
    var content=req.body.content.replace(/\r\n?/g,"\n"); 
    
    if(!isValidMarkDown(name))res.send("Illigal")
    fs.writeFileSync(config.mdwikiDir+name,content)
    res.redirect('/?name='+name);
})

app.listen(config.port);
