import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import java.util.*;

public class CommandGroup extends ConfigObject {
    private Map<String, Parameter> parameters;
    public String command;

    CommandGroup() {
        this.parameters = new HashMap<>();
        this.command = "";
    }

    public boolean updateWith(JsonObject obj) {
        try {
            JsonArray parametersArray = Util.getArraySafe(obj, PARAMETERS);
            if (parametersArray != null) {
                this.parameters.clear();
                for (JsonObject paramObj : parametersArray.getValuesAs(JsonObject.class)) {
                    Parameter newParam = new Parameter();
                    if (newParam.updateWith(paramObj)) {
                        this.parameters.put(newParam.name, newParam);
                    }
                }
            }

            this.command = Util.getStringSafeNonNull(obj, COMMAND);
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
            .add(PARAMETERS, ConfigSettings.getNode(this.getParameters()))
            .add(COMMAND, this.command)
            .build();
    }

    public static class ParameterSortOrderComparator implements Comparator<Parameter> {

        public int compare(Parameter a, Parameter b) {
            return a.sortOrder - b.sortOrder;
        }

    }

}
