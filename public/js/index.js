let inputs=document.querySelectorAll('.upload-file');
inputs.forEach(input => {
    input.addEventListener('click', function(){
       input.parentElement.parentElement.children[1].click()
       
    })
})

let fileInputs=document.querySelectorAll('.file-input');
console.log(fileInputs)
fileInputs.forEach(fileInput =>{
    
    fileInput.addEventListener('change', function(){
      var fileObject = this.files[0];
      var fileReader = new FileReader();
      fileReader.readAsDataURL(fileObject);
      fileReader.onload = function () {
        var result = fileReader.result;
        var img = fileInput.parentElement.children[3]
        img.src=result
  
      };
    })
})
/*

$('.upload-file').on("click", function(e){
    e.preventDefault();
});
*/