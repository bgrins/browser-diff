var dmp = new diff_match_patch();
var loadedFiles = 0;
var FILEREADER_OPTS = {
  on: {
    load: function(e, file) {
      var el = (loadedFiles % 2) ? "#text2" : "#text1";
      loadedFiles++;
      $(el).val(e.target.result);
    },
    error: function(e, file) {
    },
    groupend: function() {
      launch();

    }
  }
};

function getDiff(text1, text2, opts) {
  text1 = text1 || "";
  text2 = text2 || "";

  opts = opts || { };
  opts.timeout = opts.timeout || 1;
  opts.cost = opts.cost || 4;
  opts.cleanup = opts.cleanup || "semantic";


  var ms_start = (new Date()).getTime();
  var d = dmp.diff_main(text1, text2);
  var ms_end = (new Date()).getTime();

  if (opts.cleanup === "semantic") {
    dmp.diff_cleanupSemantic(d);
  }
  if (opts.cleanup === "efficiency") {
    dmp.diff_cleanupEfficiency(d);
  }

  return dmp.diff_prettyHtml(d);
}

function launch() {
  var text1 = $("#text1").val();
  var text2 = $("#text2").val();
  var timeout = parseFloat($("#timeout").val());
  var cost = parseFloat($("#editcost").val());
  var cleanup = $("#cleanup-buttons .active").text().toLowerCase();

  var ds = getDiff(text1, text2, {
    timeout: timeout,
    cost: cost,
    cleanup: cleanup
  });

  $("#outputdiv").html(ds);
}

$(function() {
  $("#launch").click(launch);
  $("textarea").bind("keyup change", launch);


  $(".btn-group .btn").bind("click", function() {
    setTimeout(launch, 10);
  });
  launch();


  FileReaderJS.setupInput($('#file-input')[0], FILEREADER_OPTS);
  FileReaderJS.setupDrop(document.body, FILEREADER_OPTS);
  FileReaderJS.setupClipboard(document.body, FILEREADER_OPTS);
});


