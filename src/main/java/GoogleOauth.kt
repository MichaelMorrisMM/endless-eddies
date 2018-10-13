import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport
import com.google.api.client.json.jackson2.JacksonFactory
import java.util.*

class GoogleOauth {
    companion object {
        // Environment Variables
        const val CLIENT_ID_ENV_KEY = "EE_GOOGLE_CLIENT_ID"

        // API objects
        const val ID_TOKEN_KEY = "idTokenString"

        fun getUserEmail(idTokenString: String) : String {
            val verifier = GoogleIdTokenVerifier
                .Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    JacksonFactory.getDefaultInstance()
                )
                .setAudience(Collections.singletonList(System.getenv(CLIENT_ID_ENV_KEY)))
                .build()

            val idToken = verifier.verify(idTokenString)
            if (idToken != null) {
                val payload = idToken.payload

                // Print user identifier
                val userId = payload.subject
                println("User ID: $userId")

                // Get profile information from payload
                val email = payload.email
                val emailVerified = java.lang.Boolean.valueOf(payload.emailVerified!!)
                val name = payload["name"] as String
                val pictureUrl = payload["picture"] as String
                val locale = payload["locale"] as String
                val familyName = payload["family_name"] as String
                val givenName = payload["given_name"] as String

                return email

            } else {
                println("Invalid ID token.")
                return ""
            }
        }
    }
}
