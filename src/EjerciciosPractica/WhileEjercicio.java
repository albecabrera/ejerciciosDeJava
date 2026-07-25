package EjerciciosPractica;

public class WhileEjercicio {
    public static void main(String[] args) {
        // --- Aufgabe 3.1 (leicht) ---
        // Zähle mit einer while-Schleife von 10 rückwärts bis 1 herunter
        // und gib danach "Start!" aus.
        int conteo_regresivo = 11;
        while (conteo_regresivo>=1) {
            conteo_regresivo --;
            System.out.println("Cuenta para atras comenzando con el número 10 = " + conteo_regresivo);
        }
    }
}
