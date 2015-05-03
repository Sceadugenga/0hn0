%rows are different puzzle sizes (5,6,7,8,12) columns are test instances

time = [1.57 2.55 1.93 1.99 2.63;...
        3.54 2.57 2.20 2.14 2.08;...
        2.73 3.18 3.04 3.92 3.23;...
        4.30 4.21 4.46 5.28 5.67;...
        11.71 16.49 16.09 24.23 26.76];
stepsE = [380 358 451 488 281;...
          937 927 853 843 740;...
          1650 1650 1650 2128 2128;...
          2922 2922 2922 2922 3619;...
          2804 2649 3091 3326 3629];
stepsR = [17 17 17 19 14; ...
          26 24 24 26 23; ...
          33 33 33 36 36; ...
          43 43 43 43 47; ...
          49 49 52 53 53];

figure;
hold on;
plot([5 6 7 8 12], mean(time, 2), 'g');
plot([5 6 7 8 12], max(time,[], 2), 'r');
plot([5 6 7 8 12], min(time,[], 2), 'b');
plot(repmat([5 6 7 8 12],1,5), time(:), 'ok'); 
title('Time measurements (5 attempts each)');
xlabel('puzzle size');
ylabel('time [ms]');
legend('average case', 'worst case', 'best case', 'measurements', 'Location','northwest');
hold off;
%fig2pdf(gcf, 'bench_time.pdf');
print(gcf,'bench_time','-dpng');


figure;
hold on;
plot([5 6 7 8 12], mean(stepsE, 2), 'g');
plot([5 6 7 8 12], max(stepsE,[], 2), 'r');
plot([5 6 7 8 12], min(stepsE,[], 2), 'b');
plot(repmat([5 6 7 8 12],1,5), stepsE(:), 'ok'); 
title('Steps in the event queue (5 attempts each)');
xlabel('puzzle size');
ylabel('number of steps');
legend('average case', 'worst case', 'best case', 'measurements', 'Location','southeast');
hold off;
%fig2pdf(gcf, 'bench_stepsE.pdf');
print(gcf,'bench_stepsE','-dpng');


figure;
hold on;
plot([5 6 7 8 12], mean(stepsR, 2), 'g');
plot([5 6 7 8 12], max(stepsR,[], 2), 'r');
plot([5 6 7 8 12], min(stepsR,[], 2), 'b');
plot(repmat([5 6 7 8 12],1,5), stepsR(:), 'ok'); 
title('Backtracking steps (5 attempts each)');
xlabel('puzzle size');
ylabel('number of steps');
legend('average case', 'worst case', 'best case', 'measurements', 'Location','southeast');
hold off;
%fig2pdf(gcf, 'bench_stepsR.pdf');
print(gcf,'bench_stepsR','-dpng');

