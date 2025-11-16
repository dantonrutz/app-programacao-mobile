import * as Notifications from "expo-notifications";

class NotificationService {
    constructor() {
        this.configure();
    }

    async configure() {
        // Configuração necessária para exibir notificações no iOS/Android
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: false,
                shouldSetBadge: false,
            }),
        });

        await this.requestPermissions();
    }

    async requestPermissions() {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== "granted") {
            await Notifications.requestPermissionsAsync();
        }
    }

    /**
     * Envia uma notificação imediatamente
     */
    async sendLocalNotification(title, body, data = {}) {
        try {
            await Notifications.scheduleNotificationAsync({
                content: { title, body, data },
                trigger: null, // mostra imediatamente
            });
        } catch (error) {
            console.log("Erro ao enviar notificação:", error);
        }
    }

    /**
     * Agenda uma notificação para daqui X segundos
     */
    async scheduleNotificationIn(seconds, title, body, data = {}) {
        try {
            await Notifications.scheduleNotificationAsync({
                content: { title, body, data },
                trigger: { seconds },
            });
        } catch (error) {
            console.log("Erro ao agendar notificação:", error);
        }
    }

    /**
     * Cancela todas as notificações agendadas
     */
    async cancelAll() {
        await Notifications.cancelAllScheduledNotificationsAsync();
    }
}

export default new NotificationService();
