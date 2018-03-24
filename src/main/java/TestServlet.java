import java.io.*;
import javax.json.*;
import javax.servlet.annotation.*;
import javax.servlet.http.*;

@WebServlet("/test")
public class TestServlet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType(Constants.MIME_JSON);
        // Needed for development (accessing from ng serve), remove for deploy
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET");
        try (PrintWriter out = response.getWriter()) {
            JsonObject reply = Json.createObjectBuilder()
                .add("message", "Hello!")
                .build();
            out.print(reply.toString());
        }
    }
}