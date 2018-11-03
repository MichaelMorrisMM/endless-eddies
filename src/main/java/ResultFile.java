import javax.json.*;

public class ResultFile extends ConfigObject {

    public String name;
    public String fileName;
    public String toolTip;
    public boolean displayInline;

    public ResultFile() {
        this.name = "";
        this.fileName = "";
        this.toolTip = "";
        this.displayInline = false;
    }

    public ResultFile(String n, String fn, String tt, boolean di) {
        this.name = n;
        this.fileName = fn;
        this.toolTip = tt;
        this.displayInline = di;

        this.updateNameForDisplay();
    }

    public ResultFile(JsonObject obj) {
        this();
        this.updateWith(obj);
    }

    public boolean updateWith(JsonObject obj) {
        if (isValidObject(obj)) {
            this.name = Util.getStringSafeNonNull(obj, NAME);
            this.fileName = Util.getStringSafeNonNull(obj, FILE_NAME);
            this.toolTip = Util.getStringSafeNonNull(obj, TOOL_TIP);
            this.updateNameForDisplay();
            if (obj.get(DISPLAY_INLINE) != null) {
                this.displayInline = obj.getBoolean(DISPLAY_INLINE);
            }
            return true;
        }
        return false;
    }

    public JsonObject toJsonObject() {
        return Json.createObjectBuilder()
            .add(NAME, this.name)
            .add(FILE_NAME, this.fileName)
            .add(TOOL_TIP, this.toolTip)
            .add(DISPLAY_INLINE, this.displayInline)
            .build();
    }

    private void updateNameForDisplay() {
        if (this.name == null || this.name.trim().equals("")) {
            this.name = this.fileName;
        }
    }

    public static boolean isValidObject(JsonObject obj) {
        return obj != null && Util.getStringSafe(obj, FILE_NAME) != null;
    }

    @Override
    public boolean equals(Object other) {
        if (other != null && other instanceof ResultFile) {
            ResultFile otherAsRF = (ResultFile) other;
            return this.name.equals(otherAsRF.name) && this.fileName.equals(otherAsRF.fileName)
                && this.toolTip.equals(otherAsRF.toolTip) && this.displayInline == otherAsRF.displayInline;
        }
        return false;
    }

}
