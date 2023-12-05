Prosty serwis społecznościowy implementowany na potrzeby przedmiotów "Języki i narządzia programowania 2" i "Języki i narzędzia programowania 3". Projekt zbudowany z użyciem Node.js na frontendzie i oparty na Pythonie backend używający Flask i SQLAlchemy. Zbudowany używając architektury mikroserwisów na podstawie kontenerów Docker.

Uruchomienie serwisu:
docker-compose up --scale dates=2

Strona serwisu:
http://localhost:8080

Możliwe operacje po zalogowaniu:
- stworzenie nowej grupy - panel po prawej
- stworzenie nowej daty - wciśnięcie własnej grupy, panel po prawej (powrót przez wciśnięcie nazwy serwisu)
- subskrypcja do grupy innego użytkownika - wpisanie danych do panelu po lewej, 
                                            fuzzy search wyszukuje podobne grupy w bazie ES, 
                                            wciśnięcie klawisza subskrybuj 
                                            (nie dodałem klawisza wyloguj, należy przejść na link localhost:8080/loginPage)
                                            
operacje dodania daty, grupy i subskrypcja są asynchroniczne, mogą wymagać odświeżenia
