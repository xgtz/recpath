var fs= require('fs');
var path=require('path');

var recursive=(function(){
    var _webSite="";
    var _fileCount =0;
    var _errLogPath="./log/err.txt";
    var _runLogPath="./log/log.txt";
    var _newLine ="\r\n-------------------------------------------\r\n";

    var _recursiveFilePath=function(){
        _mkDir();
        if("" === _webSite){
            var data=fs.readFileSync('./web.xml','utf-8');
            var reg = /\<WebPath\>(.+)\<\/WebPath\>/gmi;
            var m = reg.exec(data);
            if( m && m.length>0){
                _webSite = m[1];
                _doWork(_webSite);
            }else{
                console.log('网站路径解析错误!');
            }

        }
    };


    var _doWork=function(dic){
        fs.readdir(dic,function(err,files){
            if(err){
                _writeErrLog(err);
            }else{
                //_readFiels(dic,files);
                files.forEach(function(fileName){
                    var fileDir=path.join(dic,fileName);
                    fs.stat(fileDir,function(err,stats){
                        if(err){
                            _writeErrLog(err);
                        }else{
                            if(stats.isFile()){
                                _writeRunLog(fileDir);
                            }
                            else{
                                _doWork(fileDir);
                            }
                        }
                    });
                });
            }
        });
    };
    


    // 记录查询的文件日志
    var _writeRunLog=function(fileDir){
        _fileCount+=1;
        var info="NO:"+_fileCount+"   "+fileDir+"\r\n";
        fs.appendFile(_runLogPath,info,function(err){
            if(err) console.log(err);
        });
    };

    // 记录错误日志
    var _writeErrLog=function(err){
        var info = _newLine+err;
        fs.appendFile(_errLogPath,info,function(err){
            if(err) console.log(err);
        });
    };

    // 创建保存日志的文件夹
    var _mkDir=function(){

        fs.exists('./log',function(exists){
            if(!exists) fs.mkdir('./log');
        });
    };

    return {
        RecursiveFilePath : _recursiveFilePath
    };
})();

recursive.RecursiveFilePath();