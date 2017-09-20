var myVar;

function loader() {
    myVar = setTimeout(showPage, 500);
}
$.ajaxSetup({
  cache: false
});
function showPage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("wrapper").style.display = "block";
}
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})
