import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@WebServlet("/execute")
public class ExecuteServlet extends HttpServlet {

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
                inputs.add(new Input(param, requestObject));
            }

            File tmpDir = new File(
                ConfiguratorServlet.ROOT_PATH
                    + File.separator
                    + UUID.randomUUID().toString().replace("-", "")
            );
            tmpDir.mkdir();

            File inFile = new File(tmpDir, "in.txt");
            inFile.createNewFile();
            File outFile = new File(tmpDir, "out.txt");
            outFile.createNewFile();
            File errorFile = new File(tmpDir, "error.txt");
            errorFile.createNewFile();

            try {
                Command command = new Command(config.command, inputs);
                Process process = command.execute(inFile, outFile, errorFile, tmpDir);
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
