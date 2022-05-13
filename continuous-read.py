#!/usr/bin/env python

import socket
import time
import sys
import statistics
import socketio
import string

from chafon_rfid.base import ReaderCommand, ReaderResponseFrame
from chafon_rfid.command import (
    CF_SET_BUZZER_ENABLED, CF_SET_RF_POWER,
    CF_SET_WORK_MODE_288M,
)
from chafon_rfid.response import G2_TAG_INVENTORY_STATUS_MORE_FRAMES
from chafon_rfid.transport import TcpTransport
from chafon_rfid.transport_serial import SerialTransport
from chafon_rfid.uhfreader288m import (
    G2_TAG_INVENTORY_PARAM_ANTENNA_1, G2_TAG_INVENTORY_PARAM_ANTENNA_4, 
    G2InventoryCommand, G2InventoryResponseFrame
)
TCP_PORT = 6000
DELAY = 0.50
valid_chars = string.digits + string.ascii_letters 
def run_command(transport, command):
    transport.write(command.serialize())
    status = ReaderResponseFrame(transport.read_frame()).result_status
    return status
    
def is_marathon_tag(tag):
    tag_data = tag.epc
    return len(tag_data) == 4 and all([chr(tag_byte) in valid_chars for tag_byte in tag_data.lstrip(bytearray([0]))])


def set_power(transport, power_db):
    return run_command(transport, ReaderCommand(CF_SET_RF_POWER, data=[power_db]))

def set_buzzer_enabled(transport, buzzer_enabled):
    return run_command(transport, ReaderCommand(CF_SET_BUZZER_ENABLED, data=[buzzer_enabled and 1 or 0]))

def set_answer_mode_reader_288m(transport):
    return run_command(transport, ReaderCommand(CF_SET_WORK_MODE_288M, data=[0]))

verbose = False
running = True
transport = None
response_times = []
tag_counts = {}
rssi_values = {}


if __name__ == "__main__":    
    sio = socketio.Client(logger=True, engineio_logger=True) #logger=True, engineio_logger=True
    sio.connect('http://localhost:3000', namespaces=['/rfid'])

@sio.on('connect', namespace='/rfid')
def on_connect():
    print("I'm connected!")
    
@sio.event(namespace='/rfid')
def connect_error(data):
    print("The connection failed!")
    global running
    running = False

@sio.event(namespace='/rfid')
def disconnect():
    print("I'm disconnected!")
    global running
    running = False

@sio.on('start', namespace='/rfid')
def on_start(data):
    global transport
    print(data[0])
    transport = getTransport(data[0])
    read_tags(data[1], data[2], data[3])

@sio.on('stop', namespace='/rfid')
def on_stop(data):
    global transport
    transport.close()

@sio.on('limpar', namespace='/rfid')
def on_limpar(data):
    global tag_counts
    global rssi_values
    tag_counts = {}
    rssi_values = {}
    
def isSerial(reader_addr):
    return reader_addr.startswith('/') or reader_addr.startswith('COM')

def getTransport(reader_addr):
    print(isSerial(reader_addr))
    if (isSerial(reader_addr)):
        return SerialTransport(device=reader_addr)
    return TcpTransport(reader_addr, reader_port=TCP_PORT)


def startup(data):
    global transport
    transport = getTransport(data[0])
    read_tags(data[1], data[2], data[3])



def read_tags(power, buzzerEnabled, seconds):
    try:
        set_answer_mode_reader_288m(transport)
        get_inventory_cmd = G2InventoryCommand(q_value=4, antenna=G2_TAG_INVENTORY_PARAM_ANTENNA_1)
        get_inventory_cmd2 = G2InventoryCommand(q_value=4, antenna=G2_TAG_INVENTORY_PARAM_ANTENNA_4)
        frame_type = G2InventoryResponseFrame
        set_power(transport, power)
        set_buzzer_enabled(transport, buzzerEnabled)
    except ValueError as e:
        print('Unknown reader type: {}'.format(e))
        sys.exit(1)

    while running:
        try:
            transport.write(get_inventory_cmd.serialize())
            transport.write(get_inventory_cmd2.serialize())
            inventory_status = None
            while inventory_status is None or inventory_status == G2_TAG_INVENTORY_STATUS_MORE_FRAMES:
                resp = frame_type(transport.read_frame())
                inventory_status = resp.result_status
                for tag in resp.get_tag():
                    tag_id = tag.epc.hex()

                    tag_counts[tag_id] = tag_counts.get(tag_id, 0) + 1
                    if is_marathon_tag(tag):
                        boat_num = (tag.epc.lstrip(bytearray([0]))).decode('ascii')
                        boat_time = str(now)[:12]
                        rssi = tag.rssi
                        if verbose:
                          print('{0} {1} {2}'.format(boat_num, boat_time, rssi))
                        if appender is not None:
                          appender.add_row([boat_num, boat_time, '', ''])
                    else:
                        if verbose:
                            print("Non-marathon tag 0x%s" % (tag.epc.hex()))
                        if tag.rssi is not None:
                            if tag_id not in rssi_values:
                                rssi_values[tag_id] = 0
                            rssi_values[tag_id] = tag.rssi        
                    ##print('  {}: {} times{}'.format(tag_id, tag_counts[tag_id], rssi_values and ', average RSSI: %.2f' % (statistics.mean(rssi_values[tag_id]),) or ''))
                    #print(tag.antenna_num)
                    stringTag = str(tag_id)+','+ str(tag_counts.get(tag_id, 1))+','+str(rssi_values.get(tag_id))+ ','+ str(tag.antenna_num)+','+ str(tag.readTime)+','+str(inventory_status)
                    ##print(stringTag)
                    sio.emit('tag', stringTag, namespace='/rfid')
        except socket.error:
            print('Unable to connect to reader')
            continue
        time.sleep(seconds)
    transport.close()    

##if __name__ == "__main__":
##    startup(['/dev/ttyUSB0',12,True,0.00])
