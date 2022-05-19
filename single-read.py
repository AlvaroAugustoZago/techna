#!/usr/bin/env python

from chafon_rfid.base import CommandRunner, ReaderCommand, ReaderInfoFrame, ReaderResponseFrame
from chafon_rfid.command import CF_GET_READER_INFO, G2_TAG_INVENTORY, CF_SET_BUZZER_ENABLED, CF_SET_RF_POWER, CF_SET_WORK_MODE_288M
from chafon_rfid.response import G2_TAG_INVENTORY_STATUS_MORE_FRAMES, G2_TAG_INVENTORY_STATUS_COMPLETE
from chafon_rfid.transport import TcpTransport, MockTransport
from chafon_rfid.transport_serial import SerialTransport
from chafon_rfid.uhfreader288m import (
    G2_TAG_INVENTORY_PARAM_ANTENNA_1, G2_TAG_INVENTORY_PARAM_ANTENNA_4, 
    G2InventoryCommand, G2InventoryResponseFrame
)

import socketio


if __name__ == "__main__":
    sio = socketio.Client(logger=True, engineio_logger=True)
    sio.connect('http://localhost:3000', namespaces=['/rfid'])


def run_command(transport, command):
    transport.write(command.serialize())
    status = ReaderResponseFrame(transport.read_frame()).result_status
    return status

def set_power(transport, power_db):
    return run_command(transport, ReaderCommand(CF_SET_RF_POWER, data=[power_db]))

def set_buzzer_enabled(transport, buzzer_enabled):
    return run_command(transport, ReaderCommand(CF_SET_BUZZER_ENABLED, data=[buzzer_enabled and 1 or 0]))

transport = None
get_antenna_1 = G2InventoryCommand( antenna=G2_TAG_INVENTORY_PARAM_ANTENNA_1, session=0x02)
get_antenna_2 = G2InventoryCommand( antenna=G2_TAG_INVENTORY_PARAM_ANTENNA_4, session=0x02)
tags = []

def startup(data):
    global transport
    transport = SerialTransport(device=data[0], baud_rate=38400)
    set_power(transport, data[1])
    set_buzzer_enabled(transport, data[2])
    read_tags()

@sio.on('start', namespace='/rfid')
def on_start(data):
    startup(data)


def read_tags():
    transport.write(get_antenna_1.serialize())
    transport.write(get_antenna_2.serialize())

    inventory_status = None
    while inventory_status is None or inventory_status == G2_TAG_INVENTORY_STATUS_MORE_FRAMES:
        g2_response = G2InventoryResponseFrame(transport.read_frame())
        inventory_status = g2_response.result_status
        
        for tag in g2_response.get_tag():
            tag_id = tag.epc.hex()
            rssi = tag.rssi
            tags.append(str(tag_id) + ','+str(rssi)+ ','+ str(tag.antenna_num))
            print('Antenna %d: EPC %s, RSSI %s' % (tag.antenna_num, tag.epc.hex(), tag.rssi))
        
        if (inventory_status == G2_TAG_INVENTORY_STATUS_COMPLETE):
            sio.emit('leitura_completa', tags, namespace='/rfid')
    print('%s tags found' % (len(tags)))

    transport.close()