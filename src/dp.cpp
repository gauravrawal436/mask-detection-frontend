import java.util.Scanner;

public class Main {

    // Function to check if two strings follow the same pattern
    static boolean followPattern(String s1, String s2) {
        if (s1.length() != s2.length()) {
            return false;
        }
        int diff = s2.charAt(0) - s1.charAt(0);
        for (int i = 1; i < s1.length(); i++) {
            if (s2.charAt(i) - s1.charAt(i) != diff) {
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Number of strings: ");
        int N = scanner.nextInt();

        String[] strings = new String[N];
        System.out.println("Enter the strings:");
        for (int i = 0; i < N; i++) {
            strings[i] = scanner.next();
        }

        // Find the odd string
        String oddString = "";
        for (int i = 0; i < N; i++) {
            boolean isOdd = true;
            for (int j = 0; j < N; j++) {
                if (i != j && followPattern(strings[i], strings[j])) {
                    isOdd = false;
                    break;
                }
            }
            if (isOdd) {
                oddString = strings[i];
                break;
            }
        }

        // Output the odd string
        System.out.println("ODD STRING: " + oddString);
    }
}