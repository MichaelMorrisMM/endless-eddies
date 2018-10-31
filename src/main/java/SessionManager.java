import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

public class SessionManager {

    private static final String SESSION_COOKIE_NAME = "SESSION";
    private static final String XSRF_TOKEN = "xsrfToken";
    private static Algorithm ALGORITHM;

    static {
        SecureRandom srandom = new SecureRandom();
        byte[] secret = new byte[64];
        srandom.nextBytes(secret);
        ALGORITHM = Algorithm.HMAC512(secret);
    }

    public static boolean createSession(User user, HttpServletResponse response) {
        try {
            String xsrfToken = PasswordUtil.createSalt();
            user.currentXSRFToken = xsrfToken;

            Instant now = Instant.now();
            String jwt = JWT.create()
                .withIssuedAt(Date.from(now))
                .withExpiresAt(Date.from(now.plus(1, ChronoUnit.HOURS)))
                .withClaim("idUser", user.idUser)
                .withClaim(XSRF_TOKEN, xsrfToken)
                .sign(ALGORITHM);
            Cookie sessionCookie = new Cookie(SESSION_COOKIE_NAME, jwt);
            // TODO add secure when https is working
            sessionCookie.setHttpOnly(true);
            response.addCookie(sessionCookie);

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public static void endSession(HttpServletResponse response) {
        response.setContentType("text/html");
        Cookie sessionCookie = new Cookie(SESSION_COOKIE_NAME, "");
        // TODO add secure when https is working
        sessionCookie.setHttpOnly(true);
        sessionCookie.setMaxAge(0);
        response.addCookie(sessionCookie);
    }

    public static boolean createGuestSession(User guest, HttpServletResponse response) {
        try {
            String xsrfToken = PasswordUtil.createSalt();
            guest.currentXSRFToken = xsrfToken;

            Instant now = Instant.now();
            String jwt = JWT.create()
                .withIssuedAt(Date.from(now))
                .withExpiresAt(Date.from(now.plus(1, ChronoUnit.HOURS)))
                .withClaim("idGuest", guest.idGuest)
                .withClaim(XSRF_TOKEN, xsrfToken)
                .sign(ALGORITHM);
            Cookie sessionCookie = new Cookie(SESSION_COOKIE_NAME, jwt);
            // TODO add secure when https is working
            sessionCookie.setHttpOnly(true);
            response.addCookie(sessionCookie);

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public static User checkSession(HttpServletRequest request) {
        try {
            DecodedJWT jwt = getJWT(request);
            Instant now = Instant.now();
            if (now.compareTo(jwt.getIssuedAt().toInstant()) > 0 && now.compareTo(jwt.getExpiresAt().toInstant()) < 0) {
                User user = DatabaseConnector.getUserById(jwt.getClaim("idUser").asInt());
                user.currentXSRFToken = jwt.getClaim(XSRF_TOKEN).asString();
                return user;
            }
        } catch (Exception e) {
            return null;
        }
        return null;
    }

    public static User checkGuestSession(HttpServletRequest request) {
        try {
            DecodedJWT jwt = getJWT(request);
            Instant now = Instant.now();
            if (now.compareTo(jwt.getIssuedAt().toInstant()) > 0 && now.compareTo(jwt.getExpiresAt().toInstant()) < 0) {
                return User.getGuestUser(jwt.getClaim("idGuest").asLong());
            }
        } catch (Exception e) {
            return null;
        }
        return null;
    }

    public static User checkAdminSession(HttpServletRequest request) {
        User user = checkSession(request);
        if (user != null && user.isAdmin) {
            return user;
        } else {
            return null;
        }
    }

    public static boolean checkXSRFToken(HttpServletRequest request) {
        try {
            String jwtToken = getJWT(request).getClaim(XSRF_TOKEN).asString();
            String payloadToken = request.getParameter(XSRF_TOKEN) != null ? request.getParameter(XSRF_TOKEN) : request.getHeader(XSRF_TOKEN);
            if (jwtToken != null && payloadToken != null) {
                return jwtToken.equals(payloadToken);
            }
        } catch (Exception e) {
            return false;
        }
        return false;
    }

    private static DecodedJWT getJWT(HttpServletRequest request) {
        try {
            Cookie[] cookies = request.getCookies();
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(SESSION_COOKIE_NAME) && cookie.getValue() != null) {
                    return JWT.require(ALGORITHM).build().verify(cookie.getValue());
                }
            }
        } catch (Exception e) {
            return null;
        }
        return null;
    }

}
