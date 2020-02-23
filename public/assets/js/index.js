function initViz() {
  var containerDiv = document.getElementById("vizContainer");
  // url = "https://public.tableau.com/views/WorldIndicators/GDPpercapita?:embed=yes";
  // url = "https://public.tableau.com/views/WorldIndicators/GDPpercapita";
  // url = 'http://public.tableau.com/views/RegionalSampleWorkbook/Storms';
  // url = "https://us-west-2b.online.tableau.com/site/viralplanner/views/Test1/Sheet1?:iid=1&:embed=yes";
  // url = "https://us-west-2b.online.tableau.com/#/site/viralplanner/views/Test1/Sheet1?:iid=1";
  // url = "https://public.tableau.com/profile/danial.khan/vizhome/Test1_15824325748730/Sheet1?:embed=yes";
  // url = "https://public.tableau.com/profile/danial.khan/vizhome/Test1_15824325748730/Sheet1#!/vizhome/Test1_15824325748730/Sheet1";
  // url = "https://public.tableau.com/views/Test1_15824325748730/Sheet1?:display_count=n&:origin=viz_share_link"
  // url = "https://public.tableau.com/profile/danial.khan#!/vizhome/Test2_15824360615230/Sheet2"
  // url = "https://public.tableau.com/views/Test2_15824360615230/Sheet2?:display_count=y&publish=yes&:origin=viz_share_link";
  // url = "https://public.tableau.com/views/CasesbyProvince/Sheet22?:display_count=y&publish=yes&:origin=viz_share_link"
  url = "https://public.tableau.com/views/CasesbyProvince/Dashboard1?:display_count=y&:origin=viz_share_link";
  // url = "https://public.tableau.com/views/CasesbyProvince2_0/Dashboard1?:display_count=y&:origin=viz_share_link";
  var viz = new tableau.Viz(containerDiv, url);
}