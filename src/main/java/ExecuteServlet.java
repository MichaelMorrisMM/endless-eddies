import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.json.JsonValue;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/execute")
public class ExecuteServlet extends HttpServlet {

    public static final String IN_FILE_PATH = ConfiguratorServlet.ROOT_PATH + File.separator + "in.txt";
    public static final String OUT_FILE_PATH = ConfiguratorServlet.ROOT_PATH + File.separator + "out.txt";
    public static final String ERROR_FILE_PATH = ConfiguratorServlet.ROOT_PATH + File.separator + "error.txt";

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpUtil.doPostSetup(response);

        ConfigSettings config = ConfiguratorServlet.getCurrentConfig();
        JsonObject requestObject;
        try (JsonReader reader = Json.createReader(request.getReader())) {
            requestObject = reader.readObject();
        }

        if (requestObject != null) {
            List<Input> inputs = new ArrayList<>();
            for (Parameter param : config.getParameters()) {
                JsonValue v = requestObject.get(param.name);
                if (v != null && !v.equals(JsonValue.NULL)) {
                    inputs.add(new Input(param.name, param.code, param.type, v, requestObject));
                }
            }

            File inFile = new File(IN_FILE_PATH);
            inFile.createNewFile();
            File outFile = new File(OUT_FILE_PATH);
            outFile.createNewFile();
            File errorFile = new File(ERROR_FILE_PATH);
            errorFile.createNewFile();

            try {
                Command command = new Command(config.command, inputs);
                Process process = command.execute(inFile, outFile, errorFile);
                process.waitFor();

                StringBuilder stringBuilder = new StringBuilder();
                BufferedReader reader = new BufferedReader(new FileReader(outFile));
                String line;
                while ((line = reader.readLine()) != null) {
                    stringBuilder.append(line);
                    stringBuilder.append(System.lineSeparator());
                }

                HttpUtil.printPOSTResult(response, true, stringBuilder.toString());
            } catch (Exception e) {
                HttpUtil.printPOSTResult(response, false, "");
            }
        } else {
            HttpUtil.printPOSTResult(response, false, "");
        }
    }

}
