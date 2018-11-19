import javax.json.*;

public class ResultFile extends ConfigObject {

    public String name;
    private String fileName;
    private String toolTip;
    private boolean displayInline;
    public int sortOrder;

    ResultFile() {
        this.name = "";
        this.fileName = "";
        this.toolTip = "";
        this.displayInline = false;
        this.sortOrder = DEFAULT_SORT_ORDER;
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
            this.sortOrder = obj.getInt(SORT_ORDER, DEFAULT_SORT_ORDER);
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
            .add(SORT_ORDER, this.sortOrder)
            .build();
    }

    private void updateNameForDisplay() {
        if (this.name == null || this.name.trim().equals("")) {
            this.name = this.fileName;
        }
    }

    private static boolean isValidObject(JsonObject obj) {
        return obj != null && Util.getStringSafe(obj, FILE_NAME) != null;
    }

    @Override
    public boolean equals(Object other) {
        if (other != null && other instanceof ResultFile) {
            ResultFile otherAsRF = (ResultFile) other;
            return this.name.equals(otherAsRF.name)
                && this.fileName.equals(otherAsRF.fileName)
                && this.toolTip.equals(otherAsRF.toolTip)
                && this.displayInline == otherAsRF.displayInline
                && this.sortOrder == otherAsRF.sortOrder;
        }
        return false;
    }

}
