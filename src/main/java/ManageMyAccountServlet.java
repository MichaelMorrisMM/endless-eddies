import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

@WebServlet("/manage-my-account")
public class ManageMyAccountServlet extends HttpServlet {

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

        if (Util.isNonEmpty(request.getParameter("email"))) {
            String email = request.getParameter("email").trim().toLowerCase();
            if (!user.email.equals(email) && !DatabaseConnector.verifyEmailUnique(email)) {
                HttpUtil.printPOSTResult(response, false, "Email is already associated with a user");
                return;
            }
            user.email = email;
        }
        if (Util.isNonEmpty(request.getParameter("password"))) {
            user.salt = PasswordUtil.createSalt();
            user.password = PasswordUtil.hashPassword(request.getParameter("password"), user.salt);
        }

        if (DatabaseConnector.updateUser(user)) {
            HttpUtil.printPOSTResult(response, user, "Account updated");
        } else {
            HttpUtil.printPOSTResult(response, false, "An error occurred");
        }
    }

}
