using System.Xml;
using System.Xml.Linq;
using System.Xml.Serialization;
using System.Xml.XPath;
using System.Xml.Xsl;

using Converter.Models;

namespace Converter.Scripts;

public static class XmlHandler
{
    public static void ConfigureXml(ConverterData data)
    {
        var element = new XElement("Value",
            new XElement("MeasureFrom", data.MeasureFrom),
            new XElement("ValueFrom", data.ValueFrom),
            new XElement("MeasureTo", data.MeasureTo),
            new XElement("ValueTo", data.ValueTo));

        try
        {
            var doc = XDocument.Load("XML/Values.xml");
            var root = doc.Root;

            root?.Add(element);
            doc.Save("XML/Values.xml");
        }
        catch (Exception exception)
        {
            var doc = new XDocument();
            doc.Add(new XElement("Values", element));
            doc.Save("XML/Values.xml");
        }
    }

    public static void WriteHtml()
    {
        var xslt = new XslTransform();
        xslt.Load("XML/Transform.xsl");
        var data = new XPathDocument("XML/Values.xml");
        var writer = new XmlTextWriter(File.CreateText("wwwroot/page.html"));
        xslt.Transform(data, null, writer, null);
        writer.Close();
    }
}