import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

@WebServlet("/check-user-storage")
public class CheckUserStorageServlet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        JsonObjectBuilder builder = Json.createObjectBuilder();
        try {
            User user = HttpUtil.checkForUserSessionAllowingForGuest(request);
            if (user == null) {
                HttpUtil.printJSONResponse(response, builder.add("error", "No user session").build());
                return;
            }

            User userToCheck = user;
            String idUser = request.getParameter("idUser");
            if (Util.isNonEmpty(idUser) && user.isAdmin) {
                try {
                    userToCheck = DatabaseConnector.getUserById(Integer.parseInt(idUser));
                } catch (NumberFormatException e) {
                    HttpUtil.printJSONResponse(response, builder.add("error", "idUser cannot be parsed as integer").build());
                    return;
                }
                if (userToCheck == null) {
                    HttpUtil.printJSONResponse(response, builder.add("error", "No user with that idUser exists").build());
                    return;
                }
            } else if (Util.isNonEmpty(idUser) && !user.isAdmin) {
                HttpUtil.printJSONResponse(response, builder.add("error", "Invalid permissions").build());
                return;
            }

            JsonObject result = builder
                .add("storageUsed", StorageManager.getUserStorageSpaceUsed(userToCheck))
                .add("limitExceeded", StorageManager.userStorageLimitExceeded(userToCheck))
                .build();
            HttpUtil.printJSONResponse(response, result);
        } catch (Exception e) {
            HttpUtil.printJSONResponse(response, builder.add("error", "An error occurred").build());
        }
    }

}
