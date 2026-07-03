export const isEmpty = (str: string) => {
    if (typeof str == 'string') {
        if (str != "") {
            if (str.length != 0) {
                if (str.trim().length != 0) {
                    return true;
                }
            }
        }
    }
    else {
        return true;
    }

    return false;
}