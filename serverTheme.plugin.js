//META{"name":"serverTheme"}*//
var serverTheme = function(){};

/* Information */
serverTheme.prototype.getName = function(){
    return 'Server Specific Themes';
};
serverTheme.prototype.getDescription = function(){
    return 'Ability to use specific themes on individual servers.';
};
serverTheme.prototype.getVersion = function(){
    return '1.0.0';
};
serverTheme.prototype.getAuthor = function(){
    return '<a href="https://github.com/IRDeNial" target="_BLANK">DeNial</a>';
};

serverTheme.prototype.load = function(){
    /* Variables */
    this.themePath = process.env.APPDATA + "\\BetterDiscord\\themes\\";
    this.intervalTimer1 = null;

    /* Functions */
    this.loadServerCSS = function(serverHash) {
        this.getFileContent(this.themePath + serverHash+'.servertheme.css',this.injectCSS);
        console.log("Injected theme for server " + serverHash);
        $('#serverTheme-css').addClass('theme-'+serverHash);
    };
    this.getCurrentServerHash = function() {
        return $('.guild.selected a').attr('href').split('/')[2];
    };
    this.injectCSS = function(buffer) {
        BdApi.clearCSS("serverTheme-css");
        BdApi.injectCSS("serverTheme-css", buffer);
    };
    this.getFileContent = function(filePath,callback) {
        if(this.doesFileExist(filePath)) {
            var readStream = require('fs').createReadStream(filePath);
            var buffer = [];

            readStream.on('readable', function(){
                while ((chunk = readStream.read()) != null) {
                    buffer.push(chunk.toString().replace(/[\r\n]/gim,''));
                }
            });
            readStream.on('end', function(){
                callback(buffer.join(''));
                return 0;
            });
        } else {
            callback('');
            return 0;
        }
    };
    this.doesFileExist = function(filePath) {
        try {
            require('fs').accessSync(filePath);
            return true;
        } catch(e) {
            return false;
        }
    };
};
serverTheme.prototype.unload = function(){};
serverTheme.prototype.stop = function(){
    BdApi.clearCSS("serverTheme-css");
};
serverTheme.prototype.onSwitch = function(){
    this.loadServerCSS(this.getCurrentServerHash());
};
serverTheme.prototype.start = function(){
    this.loadServerCSS(this.getCurrentServerHash());

    $('.guild-header ul').prepend('<li><a class="server-css">Server CSS</a></li>');

    $('.guild-header ul .server-css').click(function(){
        var filePath = process.env.APPDATA + "\\BetterDiscord\\themes\\" + $('.guild.selected a').attr('href').split('/')[2] + '.servertheme.css';
        
        try {
            require('fs').accessSync(filePath);
        } catch(e) {
            require('fs').closeSync(require('fs').openSync(filePath, 'w'));
        }
        
        require('child_process').exec('start "" "' + filePath +'"');
        
    });
};