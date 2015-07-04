using Elasticsearch.Net;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Nest;

// if (Env.ScriptArgs.Count < 1)
// {
//     var message = "<program> <options>";
//     Console.WriteLine(message);
//     throw new ArgumentException(message);
// }

// foreach (var option in Env.ScriptArgs.Skip(2)) {
//     var split = option.Split('~');
//     var optionName = split[0].Replace("/", "");
//     var value = split[1];
//     Console.WriteLine(String.Format("Setting {0} to {1}", optionName, value));

//     switch (optionName)
//     {
//     }
// }

// --------------------

const string CRIME_PATH = "./data/rows.json";
const string OUT_FILE = "./data/crime.csv";

var uri = new Uri("http://10.158.170.7:9200");
var esClient = new ElasticClient(new ConnectionSettings(uri));

const string SCROLL_TIMEOUT = "10s";

var q = new {
    match_all = new {
        
    }
};
var rawQuery = JObject.FromObject(q).ToString();

Console.WriteLine(rawQuery);

var scanResults = esClient.Search<Event>(x => x
    .Index("bath-hacked")
    .Type("crime")
    .Size(500/5)
    .SearchType(SearchType.Scan)
    .QueryRaw(rawQuery)
    .Scroll(SCROLL_TIMEOUT));

if (String.IsNullOrEmpty(scanResults.ScrollId))
{
    throw new Exception("ScrollId is null, query didn't work");
}

var csvHeaders = "id,date,lat,lon,category,outcome,streetName";
File.AppendAllLines(OUT_FILE, new[]{csvHeaders});

var results = esClient.Scroll<Event>(SCROLL_TIMEOUT, scanResults.ScrollId);
while (results.Documents.Any())
{
    var docs = results.Documents.ToList();

    var lines = docs.Select(doc =>
    {
        var data = new[] {
            doc.id,
            doc.date.ToString(),
            doc.location.lat,
            doc.location.lon,
            doc.category,
            doc.outcome,
            doc.streetName
        };

        return String.Join(",", data);
    }); 

    File.AppendAllLines(OUT_FILE, lines);

    results = esClient.Scroll<Event>(SCROLL_TIMEOUT, results.ScrollId);

    var message = String.Format("Batch, {0}", docs.Count);
    Console.WriteLine(message);
}


public class GeoPoint
{
    public string lat { get; set; }
    public string lon { get; set; }
}

public class Event
{
    public string id { get; set; }
    public DateTimeOffset date { get; set; }
    public GeoPoint location { get; set; }
    public string category { get; set; }
    public string outcome { get; set; }
    public string streetName { get; set; }
    public string sourceType { get; set; }
}