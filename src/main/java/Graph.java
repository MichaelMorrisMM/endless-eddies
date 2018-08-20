import javax.json.*;

public class Graph extends ConfigObject {

    public String name;
    public String type;

    public Graph() {
        this.name = "";
        this.type = "";
    }

    public Graph(String n, String t) {
        this.name = n;
        this.type = t;
    }

    public Graph(JsonObject obj) {
        this();
        this.updateWith(obj);
    }

    public boolean updateWith(JsonObject obj) {
        if (isValidObject(obj)) {
            this.name = Util.getStringSafeNonNull(obj, NAME);
            this.type = Util.getStringSafeNonNull(obj, TYPE);
            return true;
        }
        return false;
    }

    public JsonObject toJsonObject() {
        return Json.createObjectBuilder()
            .add(NAME, this.name)
            .add(TYPE, this.type)
            .build();
    }

    public static boolean isValidObject(JsonObject obj) {
        return obj != null && Util.getStringSafe(obj, TYPE) != null;
    }

    @Override
    public boolean equals(Object other) {
        if (other != null && other instanceof Graph) {
            Graph otherAsG = (Graph) other;
            return this.name.equals(otherAsG.name) && this.type.equals(otherAsG.type);
        }
        return false;
    }

}
