import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

@WebServlet("/delete-account")
public class DeleteAccountServlet extends HttpServlet {

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        User user = SessionManager.checkSession(request);
        if (user == null) {
            HttpUtil.printPOSTResult(response, false, "No user session");
            return;
        }
        if (!SessionManager.checkXSRFToken(request)) {
            HttpUtil.printPOSTResult(response, false, "Invalid XSRF token");
            return;
        }

        String idUserToDeleteString = request.getParameter("idUser");
        if (!Util.isNonEmpty(idUserToDeleteString)) {
            HttpUtil.printPOSTResult(response, false, "No user specified");
            return;
        }
        int idUserToDelete = Integer.parseInt(idUserToDeleteString);

        if (user.isAdmin || user.idUser == idUserToDelete) {
            if (DatabaseConnector.deleteUser(idUserToDelete)) {
                HttpUtil.printPOSTResult(response, true, "User account deleted");
            } else {
                HttpUtil.printPOSTResult(response, false, "An error occurred");
            }
        } else {
            HttpUtil.printPOSTResult(response, false, "Invalid permissions");
        }
    }

}
