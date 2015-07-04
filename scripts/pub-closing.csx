
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

const string FILE_PATH = "./data/pub-rows.json";
const string OUT_FILE = "./data/pubs.csv";

JArray allData = null;
using (var json = File.OpenRead(FILE_PATH))
{
    var tr = new StreamReader(json);
    var reader = new JsonTextReader(tr);
    var jo = JToken.ReadFrom(reader);
    allData = (JArray)jo.SelectToken("data");
}

var lines = new Dictionary<string, string>();
foreach (var data in allData)
{
    var ja = (JArray)data;

    var name = ja[9].Value<string>();

    if (lines.ContainsKey(name))
    {
    	continue;
    }

    var coordinates = ja[13].Value<JArray>();
    var lat = coordinates[1].Value<string>();
    var lon = coordinates[2].Value<string>();

    var line = String.Join(",", 
    	new[] {
	    	name,
	    	lat,
	    	lon
    	});
    lines[name] = line;
}

var csvHeaders = "name,lat,lon";
var csv = new [] {csvHeaders}.Concat(lines.Values);
File.AppendAllLines(OUT_FILE, csv);
Console.WriteLine(String.Format("Written to {0}", OUT_FILE));
