public class FriendRequestThread implements Runnable {
    private final UniversityStudent sender;
    private final UniversityStudent receiver;

    public FriendRequestThread(UniversityStudent sender, UniversityStudent receiver) {
        this.sender = sender;
        this.receiver = receiver;
    }

    @Override
    public void run() {
        sender.addFriend(receiver);
        receiver.addFriend(sender);
        System.out.println(sender.name + " sent a friend request to " + receiver.name + " [Thread: " + Thread.currentThread().getName() + "]");
    }
}
