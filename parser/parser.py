# pip3 install dbfread
# from dbfread import DBF
# f = open('mariupol.csv', 'w')
# for record in DBF('dataset/mariupol.dbf'):
#     f.write('[' + record['bounds'] + ']' + "," + record['status'] + '\n')

# f.close()
import csv
import utm

f = open('mariupol-json.json', 'w')
f.write('{' + '\n')
f.write("\"features\": [")
c = 0
with open('mariupol.csv', 'r') as file:
    spamreader = csv.reader(file, delimiter=',', quotechar='|')
    for row in spamreader:
        row[0] = row[0].strip('[')
        row[3] = row[3].strip(']')
        point_1 = utm.to_latlon(float(row[0]), float(row[1]), 37, 'T')
        point_2 = utm.to_latlon(float(row[2]), float(row[3]), 37, 'T')
        # We flipped, so insteaf of lat-long it is long-lat
        pt = [(point_1[1] + point_2[1]) / 2,
              (point_1[0] + point_2[0]) / 2,
              ]
        f.write('{' + '\n')
        f.write("\"type\": \"Feature\"," + '\n')
        f.write("\"properties\": {")
        f.write("\"title\": \"" + str(c) + "\",")
        c += 1
        f.write("\"description\": \"" + row[4] + "\"")
        f.write('\n')
        f.write('},')
        f.write('\n')
        f.write("\"geometry\": {\n")
        f.write("\"coordinates\": " +
                "[" + str(pt[0]) + "," + str(pt[1]) + "],\n")
        f.write("\"type\": \"Point\"")
        f.write("}\n")
        f.write("},")
