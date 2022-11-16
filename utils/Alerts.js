import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';

export const successDailog = (title, body, onPress) => {
    Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: title,
        textBody: body,
        button: 'close',
        onPressButton: () => {typeof onPress != 'undefined' ? onPress() : Dialog.hide()}
      })
}

export const errorDailog = (title, body, onPress) => {
    Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: title,
        textBody: body,
        button: 'close',
        onPressButton: () => {typeof onPress != 'undefined' ? onPress() : Dialog.hide()}
      })
}

export const warningDailog = (title, body, onPress) => {
    Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: title,
        textBody: body,
        button: 'close',
        onPressButton: () => {typeof onPress != 'undefined' ? onPress() : Dialog.hide()}
      })
}


export const successToast = (title, body) => {
    Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: title,
        textBody: body,
        onPress: () => {Toast.hide()},
        onLongPress: () => {Toast.hide()}
      })
}

export const errorToast = (title,body) => {
    Toast.show({
        type: ALERT_TYPE.DANGER,
        title: title,
        textBody: body,
        onPress: () => {Toast.hide()},
        onLongPress: () => {Toast.hide()}
      })
}
export const warningToast = (title, body) => {
    Toast.show({
        type: ALERT_TYPE.WARNING,
        title: title,
        textBody: body,
        onPress: () => {Toast.hide()},
        onLongPress: () => {Toast.hide();}
      })
}
