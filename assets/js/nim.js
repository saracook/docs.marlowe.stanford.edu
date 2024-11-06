$(document).ready(function() {
      //the fields that will be replaced, they must match ids of input fields
      const fields = ['projectID', 'SUNetID', 'APIkey', 'partition'];
      //console.log('field check', fields);
      

      fields.forEach((element, index, array) => {
        checkPreFill(element);
      });
      //drop buttons into code blocks
      addButtons();

      generateTips(fields);

      $(document).on('click', '#generateBtn', function() {
        generateTips(fields);
      });
      $(document).on('click', '#clearBtn', function() {
        clearAll(fields)
        generateTips(fields);
      });

      function clearAll(fields) {
        for (i in fields) {
          var field = fields[i]
          var selector = '#' + field;
          var replacementText = '[' + field + ']';
          saveToSession(field, replacementText);
          autoFillSession(selector, '');
        }
      }

      function hasClass(elem, className) {
        return elem.classList.contains(className);
      }

      function generateTips(fields) {
        removeButtons();
        var codeBlocks = document.querySelectorAll('div.highlight code');

        //console.log('codeBlocks', codeBlocks);
        for (const codeBlock of codeBlocks) {

          var cleanText = codeBlock.innerText;
          //console.log('cleanText start', cleanText);
          for (i in fields) {
            var field = fields[i]
            var value = getValue(field);
            var matchStr = '[' + field + ']';
            //console.log('value', field + ' v ' + value);
            //console.log('fields loop', field);
            cleanText = replaceText(matchStr, value, cleanText);
            //console.log('cleanText after replaceText', cleanText);
          }

          //codeBlock.appendChild(document.createTextNode(cleanText));
//console.log('codeBlock new', codeBlock);
          codeBlock.textContent = cleanText;
        }
        addButtons();
}
        function replaceText(matchText, replaceText, cleanText) {
          //console.log('cleanText in replaceText', cleanText);
          var newStr = '';
          if (cleanText){
           newStr = cleanText.replace(matchText, replaceText);
          }else{
            //console.log("this ain't it champ",matchText);
          }
          
          return newStr
        }

        function addButtons() {
          var codeBlocks = document.querySelectorAll('div.language-bash pre.highlight');
          codeBlocks.forEach(function(codeBlock) {
            var copyButton = document.createElement('button');
            copyButton.className = 'copy';
            copyButton.type = 'button';
            copyButton.ariaLabel = 'Copy code to clipboard';
            copyButton.innerText = 'Copy';
            codeBlock.append(copyButton);
            //console.log('codeBlock', codeBlock);
            //codeBlock.addClass('copyBtn');
            copyButton.addEventListener('click', function() {
              var code = codeBlock.querySelector('code').innerText.trim();
              window.navigator.clipboard.writeText(code);

              copyButton.innerText = 'Copied';
              copyButton.className = 'copy bling'
              var fourSeconds = 4000;

              setTimeout(function() {
                copyButton.innerText = 'Copy';
                copyButton.className = 'copy'
              }, fourSeconds);
            });
          });
        }

        function removeButtons() {
          //to keep them from getting caught up in the regex later
          $('div.highlight button.copy').remove();
        }

        function getValue(field) {
          //console.log('getting value', field);
          var selector = '#' + field;
          var formValue = $(selector).val();
          //console.log('form value', formValue);
          var matchText = field
          //I don't love this, should have a prettier matchText for v2
          if (!formValue) {
            formValue = matchText;
          } else {

          }
          saveToSession(field, formValue);
          //console.log('saving value', formValue);
          return formValue;
        }

        function checkPreFill(field) {
          var saved = checkSession(field);
          //console.log('saved', saved);
          if (saved != field) {
            selector = '#' + field;
            autoFillSession(selector, saved);
          }
        }

        function saveToSession(field, fieldValue) {
          //console.log('sessionStorage.setItem', field + ' ' + fieldValue);
          sessionStorage.setItem(field, fieldValue);
        }

        function checkSession(field) {
          var fieldValue = sessionStorage.getItem(field);
          if (fieldValue) {
            return fieldValue;
          }
        }

        function autoFillSession(selector, fieldValue) {
          field = $(selector);
          field.val(fieldValue);
          //generateTips();
        }
      });