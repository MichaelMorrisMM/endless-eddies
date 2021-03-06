import javax.json.*;

public class GraphTemplate extends ConfigObject {

    public String name;
    private String type;
    public String filename;
    private String xAxisLabel;
    private String yAxisLabel;
    private String colorScheme;

    GraphTemplate() {
        this.name = "";
        this.type = "";
        this.filename = "";
        this.xAxisLabel = "";
        this.yAxisLabel = "";
        this.colorScheme = "";
    }

    public boolean updateWith(JsonObject obj) {
        if (isValidObject(obj)) {
            this.name = Util.getStringSafeNonNull(obj, NAME);
            this.type = Util.getStringSafeNonNull(obj, TYPE);
            this.filename = Util.getStringSafeNonNull(obj, FILE_NAME);
            this.xAxisLabel = Util.getStringSafeNonNull(obj, X_AXIS_LABEL);
            this.yAxisLabel = Util.getStringSafeNonNull(obj, Y_AXIS_LABEL);
            this.colorScheme = Util.getStringSafeNonNull(obj, COLOR_SCHEME);
            return true;
        }
        return false;
    }

    public JsonObject toJsonObject() {
        return Json.createObjectBuilder()
            .add(NAME, this.name)
            .add(TYPE, this.type)
            .add(FILE_NAME, this.filename)
            .add(X_AXIS_LABEL, this.xAxisLabel)
            .add(Y_AXIS_LABEL, this.yAxisLabel)
            .add(COLOR_SCHEME, this.colorScheme)
            .build();
    }

    private static boolean isValidObject(JsonObject obj) {
        return obj != null && Util.getStringSafe(obj, TYPE) != null && Util.getStringSafe(obj, FILE_NAME) != null && !Util.getStringSafe(obj, FILE_NAME).equals("");
    }

    @Override
    public boolean equals(Object other) {
        if (other != null && other instanceof GraphTemplate) {
            GraphTemplate otherAsG = (GraphTemplate) other;
            return this.name.equals(otherAsG.name) && this.type.equals(otherAsG.type) && this.filename.equals(otherAsG.filename) &&
                this.xAxisLabel.equals(otherAsG.xAxisLabel) && this.yAxisLabel.equals(otherAsG.yAxisLabel) && this.colorScheme.equals(otherAsG.colorScheme);
        }
        return false;
    }

}
