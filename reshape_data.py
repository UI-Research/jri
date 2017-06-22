import csv
import json
import xlrd

def csv_from_excel():

    wb = xlrd.open_workbook('data/source/JRI infographic data.xlsx')
    sh = wb.sheet_by_name('Sheet1')
    your_csv_file = open('data/source_format.csv', 'wb')
    wr = csv.writer(your_csv_file, quoting=csv.QUOTE_ALL)

    for rownum in xrange(sh.nrows):
        wr.writerow(sh.row_values(rownum))

    your_csv_file.close()

csv_from_excel()

cr = csv.reader(open("data/source_format.csv","rU"))
head = cr.next()
head_map = {}
for i in range(0, len(head)):
	cell = head[i]
	head_map["ind" + str(i)] = cell

data = {}
textData = {}
csvdata = {}

for row in cr:
	state = row[0]
	csvdata[state] = row[0:48]
	if(state == ""):
		break
	state_mod = state.replace(" ","_")
	if(state_mod not in textData):
		textData[state_mod] = {"leg_yr": 0, "tot_savings": 0, "tot_reinvest": 0, "base_yr": 0, "recentpri_dt": "", "recentpri_yr" : 0, "recentproj_yr": 0, "recentpro_dt": "", "recentpro_yr": 0, "recentpro_yr": "", "recentpar_yr":0 }
	for i in range(1, len(row)):
		val = row[i]

		header = head_map["ind" + str(i)]
		if (header == "recentpri_dt" or header == "recentpro_dt" or header == "recentpar_dt"):
			textData[state_mod][header] = val
		elif(header.find("PRI_") != -1 or header.find("PROJ_") != -1 or header.find("PAR_") != -1 or header.find("PRO_") != -1):
			spl = header.split("_")
			year = spl[1]
			code = spl[0]
			if year not in data:
				data[year] = {}
			if state not in data[year]:
				data[year][state] = {}
			data[year][state][code] = val
		elif(header in textData[state_mod]):
			if (val == ""):
				val = -99
			textData[state_mod][header] = str(int(float(val)))

# print data 
outdata = []

for year in data:
	obj = {}
	obj["year"] = year
	for state in data[year]:
		for code in data[year][state]:
			out = data[year][state][code]
				
			obj[state.replace(" ","_") + "-" + code] = out
	outdata.append(obj)

natl = csv.writer(open("data/download/All_Data.csv","wb"))
csv_head = ["state","prisonpop2007","prisonpop2008","prisonpop2009","prisonpop2010","prisonpop2011","prisonpop2012","prisonpop2013","prisonpop2014","prisonpop2015","prisonpop2016","prisonprojpop2007","prisonprojpop2008","prisonprojpop2009","prisonprojpop2010","prisonprojpop2011","prisonprojpop2012","prisonprojpop2013","prisonprojpop2014","prisonprojpop2015","prisonprojpop2016","prisonprojpop2017","prisonprojpop2018","prisonprojpop2019","prisonprojpop2020","parolepop2007","parolepop2008","parolepop2009","parolepop2010","parolepop2011","parolepop2012","parolepop2013","parolepop2014","parolepop2015","parolepop2016","probationpop2007","probationpop2008","probationpop2009","probationpop2010","probationpop2011","probationpop2012","probationpop2013","probationpop2014","probationpop2015","probationpop2016","tot_savings","tot_reinvest","legislation_yr"]
natl.writerow(csv_head)
for state in csvdata:
	row = csvdata[state]
	cw = csv.writer(open("data/download/%s.csv"%state.replace(" ","_"),"wb"))
	cw.writerow(csv_head)
	cw.writerow(row)
	natl.writerow(row)
# print outdata
# print outdata

finaldata = sorted(outdata, key=lambda k: k['year']) 
# print finaldata
# pprint finaldata
with open('data/jridata.json', 'w') as outfile:
    json.dump(finaldata, outfile, sort_keys=True)

with open('data/textData.js', 'w') as outfile:
	outfile.write("var JRI = ")
	json.dump(textData, outfile)


# {
# 	2007:{
# 		"alabama":{
# 			"pro": 12
# 		}
# 	}
# }

# [

# 	{
# 		"year": 2007
# 		"statename_pro" : num
# 	}
# ]