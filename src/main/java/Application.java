import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonReader;
import java.io.File;
import java.io.FileReader;
import java.util.*;

public class Application extends ConfigObject {

    public String name;

    public static final String NODE_PARAMETERS = "parameters";
    private Map<String, Parameter> parameters;

    public static final String COMMAND = "command";
    public String command;

    public static final String NODE_RESULT_FILES = "resultFiles";
    public List<ResultFile> resultFiles;
    public static final String NODE_GRAPHS = "graphs";
    public List<Graph> graphs;

    public Application() {
        this.name = "";
        this.parameters = new HashMap<>();
        this.command = "";
        this.resultFiles = new ArrayList<>();
        this.graphs = new ArrayList<>();
    }

    public Application(File applicationFile) throws Exception {
        this();
        try (JsonReader reader = Json.createReader(new FileReader(applicationFile))) {
            boolean result = this.updateWith(reader.readObject());
            if (!result) {
                throw new Exception("Error parsing Application_Def file");
            }
        }
    }

    public boolean updateWith(JsonObject obj) {
        try {
            JsonArray parametersArray = Util.getArraySafe(obj, NODE_PARAMETERS);
            if (parametersArray != null) {
                this.parameters.clear();
                for (JsonObject paramObj : parametersArray.getValuesAs(JsonObject.class)) {
                    Parameter newParam = new Parameter();
                    if (newParam.updateWith(paramObj)) {
                        this.parameters.put(newParam.name, newParam);
                    }
                }
            }

            JsonArray resultFilesArray = Util.getArraySafe(obj, NODE_RESULT_FILES);
            if (resultFilesArray != null) {
                this.resultFiles.clear();
                for (JsonObject resultFileObj : resultFilesArray.getValuesAs(JsonObject.class)) {
                    ResultFile newResultFile = new ResultFile();
                    if (newResultFile.updateWith(resultFileObj)) {
                        this.resultFiles.add(newResultFile);
                    }
                }
            }

            JsonArray graphsArray = Util.getArraySafe(obj, NODE_GRAPHS);
            if (graphsArray != null) {
                this.graphs.clear();
                for (JsonObject graphObj : graphsArray.getValuesAs(JsonObject.class)) {
                    Graph newGraph = new Graph();
                    if (newGraph.updateWith(graphObj)) {
                        this.graphs.add(newGraph);
                    }
                }
            }

            this.command = Util.getStringSafeNonNull(obj, COMMAND);
            this.name = Util.getStringSafeNonNull(obj, NAME);
            return true;
        } catch (Exception e) {
        }
        return false;
    }

    public List<Parameter> getParameters() {
        List<Parameter> list = new ArrayList<>(this.parameters.values());
        list.sort(new ParameterSortOrderComparator());
        return list;
    }

    public JsonObject toJsonObject() {
        return Json.createObjectBuilder()
            .add(NAME, this.name)
            .add(NODE_PARAMETERS, ConfigSettings.getNode(this.parameters))
            .add(NODE_RESULT_FILES, ConfigSettings.getNode(this.resultFiles))
            .add(NODE_GRAPHS, ConfigSettings.getNode(this.graphs))
            .add(COMMAND, this.command)
            .build();
    }

    public static class ParameterSortOrderComparator implements Comparator<Parameter> {

        public int compare(Parameter a, Parameter b) {
            return a.sortOrder - b.sortOrder;
        }

    }

}
