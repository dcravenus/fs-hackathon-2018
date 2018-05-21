const {app, BrowserWindow, session} = require('electron')
  const path = require('path')
  const url = require('url')



  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let win
  let sessionId

  function createWindow () {
    var server = require("http-server/bin/http-server");

    const ses = session.defaultSession;
    ses.webRequest.onHeadersReceived((response, callback)=> {


      if(response.responseHeaders['Set-Cookie'] || response.responseHeaders['set-cookie']) {
        let cookie = response.responseHeaders['Set-Cookie'] ? response.responseHeaders['Set-Cookie'] : response.responseHeaders['set-cookie'];
        cookie = cookie[0];
        const regex = /fssessionid=([a-zA-Z0-9-]*)/;
        if(~cookie.indexOf('fssessionid')){
          const matches = regex.exec(cookie);
          sessionId = matches[1];
        }
      }

      callback({});

    }, {urls: ["http://www.familysearch.org/auth/familysearch/login"]}, ["responseHeaders"]);

    ses.webRequest.onBeforeRequest((details, callback)=>{
      if(details.url === 'http://familysearch.org/') {
        callback({redirectURL: 'http://localhost:8080?sessionId=' + sessionId});
      } else {
        callback({});
      }

    });

    // Create the browser window.
    win = new BrowserWindow({width: 1680, height: 967})

    // and load the index.html of the app.
    win.loadURL('http://localhost:8080')

    // Emitted when the window is closed.
    win.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      win = null
    })
  }

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow)

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow()
    }

  })

  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.
