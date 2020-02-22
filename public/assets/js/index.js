function initViz() {
  var containerDiv = document.getElementById("vizContainer");
  // url = "https://public.tableau.com/views/WorldIndicators/GDPpercapita?:embed=yes";
  url = "https://public.tableau.com/views/WorldIndicators/GDPpercapita";
  // url = 'http://public.tableau.com/views/RegionalSampleWorkbook/Storms';
  var viz = new tableau.Viz(containerDiv, url);
}