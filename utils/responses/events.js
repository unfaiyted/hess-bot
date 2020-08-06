import {randomItemFromArray, resultPerTrigger} from "../utils";
import {CONFIRM} from "./generic";


export const EVENTS = {
    addEvent: {

        //Name
        //Desc
        //DateCreated
        //Date
        //Creator
        //PlannedAttendees
        //Reminder
        triggers: [
            /(?:add [a]?[n]?)|(event)|(at [\d][\d]?(am|pm) [a-z]?[a-z]?[a-z]?)|(for)/,
        ],
        help: "Add an event to the list of events",
        func: (msg) => {
            const strResults = resultPerTrigger(EVENTS.addEvent.triggers, msg.content);


            // What is the event?
            // When is the event?

            const result = db.get('events')
                .push({ title, watched: false, isNormie })
                .write();

            msg.reply(`${randomItemFromArray(CONFIRM)}, added ${(isNormie) ? "event" : ""} ${title}`)
        }


    },
    removeEvent: {},
    getActiveEvents: {}

};


const Event = (name, desc, date) => {


};
