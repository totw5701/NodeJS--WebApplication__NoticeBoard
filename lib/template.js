module.exports = {
    HTML: function(title, list, body, control){
      return `
        <!doctype html>
        <html>
        <head>
          <title>Notice borad - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">Notice board</a></h1>
          ${list}
          ${control}
          ${body}
        </body>
        </html>
      `
    },
    list:function(topics){
      var list = '<ul>';
      let i = 0;
      while(i < topics.length){
        list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
    
        i = i + 1;
      }
      list = list + '</ul>';
      return list;
    },
    authorList:function(authors, author_id){
      var tag = '';
      var i = 0;
      while(i < authors.length){
        let selected = '';
        if(author_id == authors[i].id){
          selected = ' selected'
        }
        tag += `<option value=${authors[i].id} ${selected}>${authors[i].name}</option>`
        i += 1;
      }
      return `
      <select name="author">
        ${tag}
      <select>
      `
    }
  }

