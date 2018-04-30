#ifndef __BLF_CONVERTER__
#define __BLF_CONVERTER__

#include <vector>
#include <array>
#include <string>
#include <map>

#include "../../../inc/json.hpp"
using json = nlohmann::json;

#include <Vector/BLF.h>

//DELAY:500, DIR:"Rx", CHANNEL:1, MODULE:"LIN", MSG:{"ID":81, "MSGTYPE":0, "LEN":8, "DATA":[1,2,3,4,5,6,7,8]}},
struct CAN_LIN_RECORD_T
{
    struct MESSAGE_BODY_T
    {
        unsigned int ID;                 // 11/29-bit message identifier
        unsigned char LEN;               // Data Length Code of the message (0..8)
        std::vector<unsigned char> DATA; // Data of the message (DATA[0]..DATA[7])

        MESSAGE_BODY_T() : ID(0), LEN(0), DATA() {}
        ~MESSAGE_BODY_T() {}

        json toJSON() const
        {
            json j = {
                {"ID", this->ID},
                {"LEN", this->LEN},
                {"DATA", this->DATA}};
            return j;
        }
    };

    double delay;
    unsigned short channel;
    std::string dir;

    MESSAGE_BODY_T msg;

    CAN_LIN_RECORD_T() : delay(0), channel(0), dir(""), msg() {}
    ~CAN_LIN_RECORD_T() {}

    json toJSON() const
    {
        json j = {
            {"DELAY", this->delay },
            {"CHANNEL", this->channel},
            {"DIR", this->dir},
            {"MSG", this->msg.toJSON()}};
        return j;
    }
};


int BLF_read(Vector::BLF::ObjectType module, const char *filepath, json& records);
bool BLF_write(Vector::BLF::ObjectType module, const char *filepath, const json& records);

#endif
