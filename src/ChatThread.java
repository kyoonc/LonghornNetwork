public class ChatThread implements Runnable {
    private final UniversityStudent sender;
    private final UniversityStudent receiver;
    private final String message;

    public ChatThread(UniversityStudent sender, UniversityStudent receiver, String message) {
        this.sender = sender;
        this.receiver = receiver;
        this.message = message;
    }

    @Override
    public void run() {
        String entry = sender.name + ": " + message;
        sender.addMessage(receiver.name, entry);
        receiver.addMessage(sender.name, entry);
        System.out.println(sender.name + " -> " + receiver.name + ": \"" + message + "\" [Thread: " + Thread.currentThread().getName() + "]");
    }
}
