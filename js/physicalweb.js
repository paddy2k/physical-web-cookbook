$.fn.ready(function() {
  $('#pwc-output').hide();

  $('#inputURI').on('change', function(){
    var uri = this.value;
    var maxLength = 18; // Max length of physical web URIs
    var advertisementOffset = 5; // 
    // code is array index, e.g. "http://www." is 0
    var expansionCodes = [ "http://www.", "https://www.", "http://", "https://", "tel:", "mailto:", "geo:", ".com", ".org", ".edu"  ];
    var length, data;

    var parts = [];
    expansionCodes.forEach(function(code, index){
      uri = uri.replace(code, String.fromCharCode(index));
    });

    Array.prototype.forEach.call(uri, function(character){
      var index = character.charCodeAt();
      if (expansionCodes[index]){
        character = expansionCodes[index];
      }

      parts.push({
        char: character,
        hex: ("0" + index.toString(16)).substr(-2).toUpperCase()
      });
    });

    if(parts.length > maxLength){
      throw "URI Too Long";
      return false;
    }

    length = 
            ("0" + (parts.length + advertisementOffset).toString(16))
            .substr(-2)
            .toUpperCase();

    data = {
      length: length, 
      parts: parts
    }

    var template = $('#rfduino-template').html();
    Mustache.parse(template);   // optional, speeds up future uses
    var rendered = Mustache.render(template, data);
    var $output = $('#output-code');
    $output.html(rendered);
    $('#pwc-output').show();
    hljs.highlightBlock($output.get(0));
  });

  $('#URIform').on('submit', function(e){
    e.preventDefault();

    $('#inputURI').trigger('change');
  })

  $('#pwc-download').on('click', function(){
    var $output = $('#output-code');
    var blob = new Blob([$output.text()], {'type': 'application/octet-stream'});
    this.href = window.URL.createObjectURL(blob);
  });

  $('#pwc-reset').on('click', function(){
    $('#pwc-output').hide();
    $('#inputURI').val('http://');
    $(document).scrollTop(0);
  });
});