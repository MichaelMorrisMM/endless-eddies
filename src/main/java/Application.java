import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonReader;
import java.io.File;
import java.io.FileReader;
import java.util.*;

public class Application extends ConfigObject {

    public String name;

    public static final String NODE_COMMAND_GROUPS = "commandGroups";
    public List<CommandGroup> commandGroups;
    public static final String NODE_RESULT_FILES = "resultFiles";
    public List<ResultFile> resultFiles;
    public static final String NODE_GRAPHS = "graphs";
    public List<GraphTemplate> graphs;

    public Application() {
        this.name = "";
        this.commandGroups = new ArrayList<>();
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
            JsonArray commandGroupsArray = Util.getArraySafe(obj, NODE_COMMAND_GROUPS);
            if (commandGroupsArray != null) {
                this.commandGroups.clear();
                for (JsonObject commandGroupObj : commandGroupsArray.getValuesAs(JsonObject.class)) {
                    CommandGroup newGroup = new CommandGroup();
                    if (newGroup.updateWith(commandGroupObj)) {
                        this.commandGroups.add(newGroup);
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
                    GraphTemplate newGraphTemplate = new GraphTemplate();
                    if (newGraphTemplate.updateWith(graphObj)) {
                        this.graphs.add(newGraphTemplate);
                    }
                }
            }

            this.name = Util.getStringSafeNonNull(obj, NAME);
            return true;
        } catch (Exception e) {
        }
        return false;
    }

    public List<Parameter> getParameters() {
        List<Parameter> list = new ArrayList<>();
        for (CommandGroup group : this.commandGroups) {
            list.addAll(group.getParameters());
        }
        return list;
    }

    public JsonObject toJsonObject() {
        return Json.createObjectBuilder()
            .add(NAME, this.name)
            .add(NODE_COMMAND_GROUPS, ConfigSettings.getNode(this.commandGroups))
            .add(NODE_RESULT_FILES, ConfigSettings.getNode(this.resultFiles))
            .add(NODE_GRAPHS, ConfigSettings.getNode(this.graphs))
            .add(PARAMETERS, ConfigSettings.getNode(this.getParameters()))
            .build();
    }

}
