 
csv =  csvread('datasample.csv');

plot(csv);

wt = modwt(csv,'haar',4);
mra = modwtmra(wt,'haar');

plot(mra);