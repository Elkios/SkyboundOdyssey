import firebase from "./firebase";
import {getDatabase, ref, set, onValue} from "firebase/database";
import {initializeApp} from "firebase/app";

class dbCRUD {

    getLeaderBoard() {
        const db = getDatabase();
        const starCountRef = ref(db, '/');
        let data;
        onValue(starCountRef, (snapshot) => {
            data = snapshot.val();
        });
        return data;
    }

    setRank(username, distance, coins) {
        const db = getDatabase();
        const uuid = localStorage.getItem("uuid");
        if ((uuid != null || uuid !== undefined) &&
            (username != null || username !== undefined) &&
            (distance != null || distance !== undefined) &&
            (coins != null || coins !== undefined)) {
            set(ref(db, '/' + uuid), {
                username: username,
                travelDistance: distance,
                coins: coins
            });
        }
    }
}

export default dbCRUD;