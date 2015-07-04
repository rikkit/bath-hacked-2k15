using Newtonsoft.Json;
using Nest;

const string CRIME_PATH = "./data/rows.json";

var uri = new Uri("http://localhost:9200");
var esClient = new ElasticClient(new ConnectionSettings(uri));

using (var json = File.OpenRead(CRIME_PATH))
{
    var tr = new StreamReader(json);
    var reader = new JsonTextReader(tr);
    var jo = JToken.ReadFrom(reader);
    var allData = (JArray)jo.SelectToken("data");

    int counter = 0;
    foreach (var batch in allData.Batch(500))
    {
        var events = new List<Event>(500);
        foreach (var data in batch)
        {
            var ja = (JArray)data;

            var id = ja[1].Value<string>();
            var date = ja[9].Value<DateTime>();
            var type = ja[10].Value<string>();

            var coordinates = ja[11].ToObject<JArray>();
            var lat = coordinates[1].Value<string>();
            var lon = coordinates[2].Value<string>();

            var streetName = ja[12].Value<string>();
            var sourceType = ja[13].Value<string>();
            var outcome = ja[15].Value<string>();

            var e = new Event
            {
                id = id,
                date = date,
                category = type,
                location = new GeoPoint
                {
                    lat = lat,
                    lon = lon
                },
                outcome = outcome,
                streetName = streetName,
                sourceType = sourceType
            };

            events.Add(e);
        }

        var d = new BulkDescriptor();
        foreach (var e in events)
        {
            d.Index<Event>(i => i
                .Index("bath-hacked")
                .Type("crime")
                .Document(e));
        }

        esClient.Bulk(d);

        counter += 500;

        Thread.Sleep(100);
        Console.WriteLine($"{counter}");
    }
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